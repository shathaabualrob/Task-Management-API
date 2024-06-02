import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Task } from "../entities/Task";

const taskRepository = getRepository(Task); 

export const createTask = async (req: Request, res: Response) => {
    const {title, description} = req.body;
    const newTask = taskRepository.create({
        title,
        description,
        completed: false,
        user: req.user // Assuming the auth middleware sets req.user
    })
    await taskRepository.save(newTask);
    res.status(201).json(newTask);

}

export const getAllTasks = async (req: Request, res: Response) => {
    
    if(!req.user){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await taskRepository.find({where: {user: req.user}});
    return res.json(tasks);
}

export const getTask = async (req: Request, res: Response) => {

    if(!req.user){
        return res.status(401).json({ message: "Unauthorized" });
    }
   
    try {
        const task = await taskRepository.findOne({
            where: {
                id: parseInt(req.params.id, 10), // Ensure taskId is a number - convert string to number
                user: { id: req.user.id }
            },
            relations: ["user"]
        });

        if(!task){
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
    
}
export const updateTask = async (req: Request, res: Response) => {
    const {title, description, completed} = req.body;
    
    if(!req.user){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const foundTask = await taskRepository.findOne({
        where:{
            id: parseInt(req.params.id),
            user: req.user
        },
        relations: ['user']
    });

    if(!foundTask){
        return res.status(404).json({ message: "Task not found" });
    }

    foundTask.title = title || foundTask.title;
    foundTask.description = description || foundTask.description;
    foundTask.completed = completed || foundTask.completed;

    await taskRepository.save(foundTask);
    res.json(foundTask);
}

export const deleteTask = async (req: Request, res: Response) => {
    if(!req.user){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const foundTask = await taskRepository.findOne({
        where:{
            id: parseInt(req.params.id),
            user: req.user
        },
        relations: ['user']
    });

    if(!foundTask){
        return res.status(404).json({ message: "Task not found" });
    }

    await taskRepository.remove(foundTask);
    res.status(204).send();
}
