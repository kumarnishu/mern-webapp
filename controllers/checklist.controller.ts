import { NextFunction, Request, Response } from "express"
import { IChecklist, IChecklistBody } from "../types/checklist.types";
import { User } from "../models/users/user.model";
import isMongoId from "validator/lib/isMongoId";
import { isvalidDate } from "../utils/isValidDate";
import { Checklist } from "../models/checklist/checklist.model";


export const CreateChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const { title, sheet_url, upto_date, start_date } = req.body as IChecklistBody & { upto_date: string, start_date: string }

    let id = req.params.id
    if (!title || !sheet_url || !id || !upto_date)
        return res.status(400).json({ message: "please provide all required fields" })

    if (!isvalidDate(new Date(upto_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })
    let user = await User.findById(id)
    if (!user)
        return res.status(404).json({ message: 'user not exists' })

    let boxes: IChecklist['boxes'] = []
    if (upto_date) {
        let current_date = new Date(start_date)
        while (current_date <= new Date(upto_date)) {
            boxes.push({ desired_date: new Date(current_date) })
            current_date.setDate(new Date(current_date).getDate() + 1)
        }
    }
    if (user) {
        let checklist = new Checklist({
            owner: user,
            title,
            sheet_url,
            boxes,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        })
        await checklist.save()
    }
    return res.status(201).json({ message: `new Checklist added` });
}

export const EditChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const { title, sheet_url, user_id } = req.body as IChecklistBody & { user_id: string }

    let id = req.params.id
    if (!title || !sheet_url)
        return res.status(400).json({ message: "please provide all required fields" })
    let checklist = await Checklist.findById(id)
    if (!checklist)
        return res.status(404).json({ message: 'checklist not exists' })

    if (user_id) {
        let user = await User.findById(user_id)
        if (user)
            checklist.owner = user
    }


    checklist.title = title
    checklist.sheet_url = sheet_url

    await checklist.save()
    return res.status(200).json({ message: `Checklist updated` });
}


export const AddMoreCheckBoxes = async (req: Request, res: Response, next: NextFunction) => {
    const { upto_date } = req.body as IChecklistBody & { upto_date: string }
    let id = req.params.id
    if (!id || !upto_date)
        return res.status(400).json({ message: "please provide all required fields" })

    if (!isvalidDate(new Date(upto_date)))
        return res.status(400).json({
            message: "please provide valid date"
        })
    let checklist = await Checklist.findById(id)
    if (!checklist)
        return res.status(404).json({ message: 'checklist not exists' })
    let boxes: IChecklist['boxes'] = checklist.boxes
    if (upto_date) {
        if (boxes.length > 0) {
            console.log("entered")
            let current_date = new Date(boxes[boxes.length - 1].desired_date)
            current_date.setDate(new Date(current_date).getDate() + 1)
            while (current_date <= new Date(upto_date)) {
                boxes.push({ desired_date: new Date(current_date) })
                current_date.setDate(new Date(current_date).getDate() + 1)
            }
        }
    }
    checklist.boxes = boxes
    checklist.updated_by = req.user
    checklist.updated_at = new Date()
    await checklist.save()
    return res.status(201).json({ message: `more boxes added successfully` });
}

export const DeleteChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let checklist = await Checklist.findById(id)
    if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" })
    }
    await checklist.remove()
    return res.status(200).json({ message: `Checklist deleted` });
}

export const GetCheckLists = async (req: Request, res: Response, next: NextFunction) => {
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)
    let id = req.query.id
    let start_date = req.query.start_date
    let end_date = req.query.end_date
    let checklists: IChecklist[] = []
    let count = 0
    if (!Number.isNaN(limit) && !Number.isNaN(page)) {

        if (!id) {
            checklists = await Checklist.find().populate('owner').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Checklist.find().countDocuments()
        }
        if (id) {
            checklists = await Checklist.find({ owner: id }).populate('owner').populate('updated_by').populate('created_by').sort('-created_at').skip((page - 1) * limit).limit(limit)
            count = await Checklist.find({ id: id }).countDocuments()
        }

        if (start_date && end_date) {
            let dt1 = new Date(String(start_date))
            let dt2 = new Date(String(end_date))
            checklists = checklists.map((checklist) => {
                let updated_checklist_boxes = checklist.boxes
                updated_checklist_boxes = checklist.boxes.filter((box) => {
                    if (box.desired_date >= dt1 && box.desired_date <= dt2)
                        return box
                })
                checklist.boxes = updated_checklist_boxes
                return checklist
            })
        }

        return res.status(200).json({
            checklists,
            total: Math.ceil(count / limit),
            page: page,
            limit: limit
        })
    }
    else
        return res.status(400).json({ message: "bad request" })
}

export const GetMyCheckLists = async (req: Request, res: Response, next: NextFunction) => {
    let start_date = req.query.start_date
    let end_date = req.query.end_date

    let checklists = await Checklist.find({ owner: req.user._id }).populate('owner').populate('updated_by').populate('created_by').sort('-created_at')

    if (start_date && end_date) {
        let dt1 = new Date(String(start_date))
        let dt2 = new Date(String(end_date))
        checklists = checklists.map((checklist) => {
            let updated_checklist_boxes = checklist.boxes
            updated_checklist_boxes = checklist.boxes.filter((box) => {
                if (box.desired_date >= dt1 && box.desired_date <= dt2)
                    return box
            })
            checklist.boxes = updated_checklist_boxes
            return checklist
        })
    }
    return res.status(200).json(checklists)
}

export const ToogleMyChecklist = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    let date = new Date(String(req.query.date))
    if (!isMongoId(id)) return res.status(400).json({ message: " id not valid" })

    let checklist = await Checklist.findById(id)
    if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" })
    }

    let updated_checklist_boxes = checklist.boxes
    updated_checklist_boxes = checklist.boxes.map((box) => {
        let updated_box = box
        if (updated_box.desired_date.getDate() === date.getDate() && updated_box.desired_date.getMonth() === date.getMonth() && updated_box.desired_date.getFullYear() === date.getFullYear())
            updated_box.actual_date = new Date()
        return updated_box
    })
    checklist.boxes = updated_checklist_boxes
    await checklist.save()
    return res.status(200).json("successfully changed")
}