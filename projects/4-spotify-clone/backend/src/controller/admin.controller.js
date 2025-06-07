import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import fs from "fs/promises";

// helper function to delete temporary files
// 已经在index.js中配置了定时任务删除，这里只是为了测试
const deleteTempFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Temporary file deleted: ${filePath}`);
  } catch (error) {
    console.log(`Error deleting temporary file ${filePath}:`, error);
  }
};

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      // 非图片文件需要指定类型，通过auto来实现智能文件类型检测
      resource_type: "auto",
      folder: "spotify-clone",
    });
    // 从结果看，URL中包含public_id，但是依然选择单独存储public_id
    // console.log("result:----->", result);
    // 返回完整信息，而不只是 URL
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    // 这里抛出的异常，由调用处的next来处理
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  const session = await mongoose.startSession();
  let audioResult = null;
  let imageResult = null;

  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;

    // 上传文件，获取完整信息
    audioResult = await uploadToCloudinary(req.files.audioFile);
    imageResult = await uploadToCloudinary(req.files.imageFile);

    // 数据库操作
    const song = await session.withTransaction(async () => {
      const newSong = new Song({
        title,
        artist,
        audioUrl: audioResult.url,
        imageUrl: imageResult.url,
        // 保存 public_id 以便后续删除
        audioPublicId: audioResult.publicId,
        imagePublicId: imageResult.publicId,
        duration,
        albumId: albumId || null,
      });

      await newSong.save({ session });

      if (albumId) {
        await Album.findByIdAndUpdate(
          albumId,
          { $push: { songs: newSong._id } },
          { session }
        );
      }

      return newSong;
    });

    // 删除临时文件
    await deleteTempFile(req.files.audioFile.tempFilePath);
    await deleteTempFile(req.files.imageFile.tempFilePath);

    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);

    // 使用正确的 resource_type 进行清理
    try {
      if (audioResult?.publicId) {
        // 非图片类型文件的删除，需要指定resource_type，否则无法删除
        await cloudinary.uploader.destroy(audioResult.publicId, {
          resource_type: "video", // 音频文件指定为 video 类型
        });
      }
      if (imageResult?.publicId) {
        await cloudinary.uploader.destroy(imageResult.publicId); // 图片使用默认
      }
    } catch (cleanupError) {
      console.log("Error cleaning up uploaded files", cleanupError);
    }

    // 删除临时文件（即使上传失败也要清理）
    if (req.files?.audioFile?.tempFilePath) {
      await deleteTempFile(req.files.audioFile.tempFilePath);
    }
    if (req.files?.imageFile?.tempFilePath) {
      await deleteTempFile(req.files.imageFile.tempFilePath);
    }

    next(error);
  } finally {
    await session.endSession();
  }
};

export const deleteSong = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    // 获取歌曲信息以删除 Cloudinary 中的文件
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    await session.withTransaction(async () => {
      // 从专辑中移除歌曲引用
      if (song.albumId) {
        await Album.findByIdAndUpdate(
          song.albumId,
          { $pull: { songs: song._id } },
          { session }
        );
      }

      // 删除数据库记录
      await Song.findByIdAndDelete(id, { session });
    });

    // 删除 Cloudinary 文件 - 注意指定 resource_type
    try {
      if (song.audioPublicId) {
        // 音频文件需要指定 resource_type 为 "video"
        await cloudinary.uploader.destroy(song.audioPublicId, {
          resource_type: "video",
        });
      }
      if (song.imagePublicId) {
        // 图片文件使用默认的 "image" 类型
        await cloudinary.uploader.destroy(song.imagePublicId);
      }
    } catch (error) {
      console.log("Error deleting files from cloudinary", error);
      // 这里不抛出错误，因为数据库操作已经成功
    }

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  } finally {
    await session.endSession();
  }
};

export const createAlbum = async (req, res, next) => {
  let imageResult = null;

  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    // 上传图片，获取完整信息
    imageResult = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl: imageResult.url,
      imagePublicId: imageResult.publicId, // 保存 public_id
      releaseYear,
    });

    await album.save();

    // 删除临时文件
    await deleteTempFile(imageFile.tempFilePath);

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);

    // 如果数据库操作失败，清理已上传的图片
    try {
      if (imageResult?.publicId) {
        await cloudinary.uploader.destroy(imageResult.publicId);
      }
    } catch (cleanupError) {
      console.log("Error cleaning up uploaded image", cleanupError);
    }

    // 删除临时文件（即使上传失败也要清理）
    if (req.files?.imageFile?.tempFilePath) {
      await deleteTempFile(req.files.imageFile.tempFilePath);
    }

    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    // 获取数据（事务外）
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const songs = await Song.find({ albumId: id });

    // 数据库操作在事务内
    await session.withTransaction(async () => {
      await Song.deleteMany({ albumId: id }, { session });
      await Album.findByIdAndDelete(id, { session });
    });

    // 删除 Cloudinary 文件（事务外，之前在事务内，导致报错）
    for (const song of songs) {
      try {
        if (song.audioPublicId) {
          await cloudinary.uploader.destroy(song.audioPublicId, {
            resource_type: "video",
          });
        }
        if (song.imagePublicId) {
          await cloudinary.uploader.destroy(song.imagePublicId);
        }
      } catch (error) {
        console.log("Error deleting song files from cloudinary", error);
      }
    }

    // 删除专辑封面
    try {
      if (album.imagePublicId) {
        await cloudinary.uploader.destroy(album.imagePublicId);
      }
    } catch (error) {
      console.log("Error deleting album image from cloudinary", error);
    }

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  } finally {
    await session.endSession();
  }
};

// 用于判断当前用户是否admin，主要的处理逻辑在路由中，因为路由中使用requireAdmin
export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
