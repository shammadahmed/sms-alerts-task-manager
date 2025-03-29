import { bcms } from '~/bcms-client';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    await bcms.entry.deleteById(body.projectId, 'project');
});
