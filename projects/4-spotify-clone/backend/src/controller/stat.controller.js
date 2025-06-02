import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] =
      // 使用Promise.all并发执行多个异步操作
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),
        // 因为没有artist的Model，所以通过查询所有歌曲的艺术家，并去重，得到艺术家的数量
        // 聚合操作是一个一个的stage组成，下面数组中的每个{}就是一个stage
        Song.aggregate([
          // 1️⃣合并stage
          {
            // 为什么合并？因为有些歌曲没有专辑，所以需要合并歌曲和专辑
            $unionWith: {
              coll: "albums", // albums指的是Album
              pipeline: [],
            },
          },
          // 2️⃣分组stage
          {
            $group: {
              // artist是Album和Song中的一个字段，在管道聚合中使用字段，需要使用$前缀
              _id: "$artist",
            },
          },
          // 3️⃣计数stage
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalAlbums,
      totalSongs,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};
