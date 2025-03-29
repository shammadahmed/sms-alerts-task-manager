import { EntryParsedCreateData } from '@thebcms/client';
import { bcms } from '~/bcms-client';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const request: EntryParsedCreateData = {
        meta: [
            {
                lng: "en",
                data: {
                    title: body.title,
                    slug: body.title,
                    description: body.description,
                    due_date: {
                        timestamp: body.due_date.timestamp,
                        timezoneOffset: body.due_date.timezoneOffset
                    },
                    complete: body.complete,
                    priority: body.priority,
                    project: {
                        entryId: body.projectId,
                        templateId: '67c8fd885ab1d0bab17d107f'
                    }
                }
            }
        ],
        statuses: [],
        content: [{
            lng: "en",
            nodes: [],
            plainText: ""
        }]
    };
        

    await bcms.entry.create('task', request);
});