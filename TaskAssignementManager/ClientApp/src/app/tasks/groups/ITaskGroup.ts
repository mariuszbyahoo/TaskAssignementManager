import { IUserTask } from "../userTasks/IUserTask";

export interface ITaskGroup {
    id: string,
    name: string,
    userTasks: IUserTask[]
}
