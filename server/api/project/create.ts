import { EntryParsedCreateData } from '@thebcms/client';
import { bcms } from '~/bcms-client';
import type { ProjectEntryMetaItem } from '~/bcms/types/ts';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const request: EntryParsedCreateData = {
        meta: [
            {
                lng: "en",
                data: {
                    title: body.title,
                    slug: body.title
                } as ProjectEntryMetaItem
            }
        ],
        statuses: [],
        content: [{
            lng: "en",
            nodes: [],
            plainText: ""
        }]
    };

    await bcms.entry.create('project', request);
});