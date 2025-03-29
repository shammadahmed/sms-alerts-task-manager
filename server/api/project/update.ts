import { EntryParsedUpdateData } from '@thebcms/client';
import { bcms } from '~/bcms-client';
import { ProjectEntryMetaItem } from '~/bcms/types/ts';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const request: EntryParsedUpdateData = {
        meta: {
            title: body.title,
            slug: body.title
        } as ProjectEntryMetaItem,
        content: [{
            lng: "en",
            nodes: [],
            plainText: ""
        }],
        lng: "en"
    };

    const res = await bcms.entry.update('project', body.projectId, request);
});
