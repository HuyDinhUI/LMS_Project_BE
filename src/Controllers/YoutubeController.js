import { YoutubeService } from "../Services/YoutubeService.js"

const SearchVideoYoutube = async (req, res) => {
    const {keyword} = req.query
    try{
        const result = await YoutubeService.Search(keyword)
        res.status(200).json({message:'Lấy danh sách video thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

export const YoutubeController = {
    SearchVideoYoutube
}