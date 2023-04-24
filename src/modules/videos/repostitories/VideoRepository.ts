import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

class VideoRepository {
    upload(request: Request, response: Response) {
        const { title, profile, stats, thumblink, channelimage, videolink, user_id } = request.body;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'INSERT INTO uploadedvideos (uploadedvideo_id, title, profile, stats, thumblink, channelimage, videolink, user_id) VALUES (?,?,?,?,?,?,?,?)',
                [uuidv4(), title, profile, stats, thumblink, channelimage, videolink, user_id],
                (error: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json(error)
                    }
                    response.status(200).json({ message: 'Vídeo criado com sucesso!' });
                }
            )
        });
    }

    getVideos(request: Request, response: Response) {
        const { user_id } = request.params;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM uploadedvideos WHERE user_id = ?',
                [user_id],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro.' })
                    }

                    if (results == false) {
                        return response.status(400).json({ error: 'Usuário não encontrado ou não há videos enviados.' })
                    }

                    return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results })
                }
            )
        })
    }

    getAllVideos(request: Request, response: Response) {
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM uploadedvideos',
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro.' })
                    }

                    if (results == false) {
                        return response.status(400).json({ error: 'Usuário não encontrado ou não há videos enviados.' })
                    }

                    return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results })
                }
            )
        })
    }

    searchVideos(request: Request, response: Response) {
        const { input } = request.query;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM uploadedvideos WHERE title LIKE ?',
                [`%${input}%`],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro.' })
                    }

                    if (results == false) {
                        return response.status(400).json({ error: 'Nada encontrado.' })
                    }

                    return response.status(200).json({ message: 'Videos retornados com sucesso', videos: results })
                }
            )
        })
    }
};

export default VideoRepository;