import { bcms } from '~/bcms-client';
import type { ProjectEntry, ProjectEntryMeta, ProjectEntryMetaItem } from '~/bcms/types/ts';

export type ProjectsResponse = ProjectEntryMeta & {
    id: number
};

export default defineEventHandler(async () => {
    try {
    const projects = (await bcms.entry.getAll('project')) as ProjectEntry[];

} catch (err) {console.log(err.message)}

    const res: ProjectsResponse = projects.map((project: ProjectEntryMetaItem) => {
        let id = project._id

        project = project.meta.en as ProjectEntryMeta;
        project.id = id;

        return project
    });

    return res;
});
