import { bcms } from '~/bcms-client';
import type { TaskEntry, TaskEntryMeta, TaskEntryMetaItem } from '~/bcms/types/ts';

export type TasksResponse = TaskEntryMetaItem & {
    id: number
};

export default defineEventHandler(async () => {
    const tasks = (await bcms.entry.getAll('task')) as TaskEntry[];

    const res: TasksResponse = tasks.map((task: TaskEntryMeta) => {
        let id = task._id

        task = task.meta.en as TaskEntryMetaItem;
        task.id = id;

        return task;
    });

    return res;
});