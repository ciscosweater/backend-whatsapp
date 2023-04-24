import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';

class UserRepository {
    register(request: Request, response: Response) {
        const { name, email, password } = request.body;
        pool.getConnection((err: any, connection: any) => {
            hash(password, 10, (err, hash) => {
                if (err) {
                    return response.status(500).json(err)
                }
                connection.query(
                    'INSERT INTO users (id, name, email, password) VALUES (?,?,?,?)',
                    [uuidv4(), name, email, hash],
                    (error: any) => {
                        connection.release();
                        if (error) {
                            return response.status(400).json(error)
                        }
                        response.status(200).json({ success: true, name: name });
                    }
                )
            });
        })
    }

    login(request: Request, response: Response) {
        const { email, password } = request.body;
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (error: any, results: any) => {
                    connection.release();
                    if (error) {
                        return response.status(400).json({ error: 'Erro.' })
                    }

                    if (results == false) {
                        return response.status(400).json({ error: 'Email não encontrado.' })
                    }

                    compare(password, results[0].password, (err, result) => {
                        if (err) {
                            return response.status(400).json({ error: 'Erro.' })
                        }

                        if (result == false) {
                            return response.status(400).json({ error: 'Senha incorreta.' })
                        }

                        if (result == true) {
                            return response.status(200).json({ success: true, name: results[0].name })
                        }
                    })
                }
            )
        })
    }
};

export default UserRepository;