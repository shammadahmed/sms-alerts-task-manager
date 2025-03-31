import { EntryParsedUpdateData } from '@thebcms/client';
import { bcms } from '~/bcms-client';
import { TaskEntryMetaItemPriority } from '~/bcms/types/ts';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const request: EntryParsedUpdateData = {
        meta: {
            title: body.title,
            slug: body.title,
            description: body.description,
            priority: body.priority as TaskEntryMetaItemPriority,
            due_date: body.due_date,
            complete: body.complete,
            project: {
                entryId: body.projectId,
                templateId: '67c8fd885ab1d0bab17d107f'
            }
        },
        content: [{
            lng: "en",
            nodes: [],
            plainText: ""
        }],
        lng: "en"
    };

    await bcms.entry.update('task', body.taskId, request);
});