import { Request, Response } from "express";
import prisma from "../config/db.config.js";

class ChatGroupController {
  static async index(req: Request, res: Response) {
    try {
      const user = req.user;
      const groups = await prisma.chatGroup.findMany({
        where: {
          user_id: user.id,
        },
        orderBy: {
          created_at: "desc",
        }
      });
      return res.json({ message: "Chat Groups fetched successfully!" , data: groups});
    } catch (error) {
      return res.status(500).json({ message: "Something went Wrong" });
    }
  }

  static async show(req: Request, res: Response) {
    try {
      const{id} = req.params;
      const user = req.user;
      const groups = await prisma.chatGroup.findUnique({
        where: {
          id: id
        },
      });
      return res.json({ message: "Chat Group fetched successfully!" , data: groups});
    } catch (error) {
      return res.status(500).json({ message: "Something went Wrong" });
    }
  }

  static async store(req: Request, res: Response) {
    try {
      //   check if the token is right or not
      const body = req.body;
      const user = req.user;
      await prisma.chatGroup.create({
        data: {
          title: body.title,
          passcode: body.passcode,
          user_id: user.id,
        },
      });
      return res.json({ message: "Chat Group created successfully!" });
    } catch (error) {
      return res.status(500).json({ message: "Something went Wrong" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      //   check if the token is right or not
      const body = req.body;
      const {id} = req.params;
      await prisma.chatGroup.update({
        data: {
          title: body.title,
          passcode: body.passcode,
        },
        where: {
          id: id, 
        }
      });
      return res.json({ message: "Chat Group updated successfully!" });
    } catch (error) {
      return res.status(500).json({ message: "Something went Wrong" });
    }
  }

  static async destroy(req: Request, res: Response) {
    try {
      const{id} = req.params;
      const user = req.user;
      await prisma.chatGroup.delete({
        where: {
          id: id
        },
      });
      return res.json({ message: "Chat Group deleted successfully!"});
    } catch (error) {
      return res.status(500).json({ message: "Something went Wrong" });
    }
  }
}

export default ChatGroupController;
