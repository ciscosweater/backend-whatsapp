import { Router } from "express";
import VideoRepository from "../modules/videos/repostitories/VideoRepository";
import { login } from '../middleware/login';

const videoRoutes = Router();
const videoRepository = new VideoRepository()

videoRoutes.post('/create-video', login, (request, response) => {
    videoRepository.upload(request, response);
});

videoRoutes.get('/list-videos/:user_id', login, (request, response) => {
    videoRepository.getVideos(request, response);
});

videoRoutes.get('/search', (request, response) => {
    videoRepository.searchVideos(request, response);
});

videoRoutes.get('/homevideos', (request, response) => {
    videoRepository.getAllVideos(request, response);
})

export { videoRoutes };