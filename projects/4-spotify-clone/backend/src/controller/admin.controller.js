import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      // 非图片文件需要指定类型，通过auto来实现智能文件类型检测
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    // 这里抛出的异常，由调用处的next来处理
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    // audioFile 和 imageFile 是前端传递的文件对象
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    // if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    // 在index.js中定义了全局错误处理中间件，所以这里可以调用next(error)
    next(error);
  }
};

// TODO 添加了事务处理
export const deleteSong = async (req, res, next) => {
  // 开启事务
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;

    await session.withTransaction(async () => {
      // if song belongs to an album, update the album's songs array
      const song = await Song.findById(id).session(session);
      if (song.albumId) {
        await Album.findByIdAndUpdate(
          song.albumId,
          {
            $pull: { songs: song._id },
          },
          { session }
        );
      }

      await Song.findByIdAndDelete(id, { session });
    });

    // TODO：删除cloudinary中的文件，需要先存储文件的public_id

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  } finally {
    await session.endSession();
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  // 开启事务
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    await session.withTransaction(async () => {
      await Song.deleteMany({ albumId: id }, { session });
      await Album.findByIdAndDelete(id, { session });
    });
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
