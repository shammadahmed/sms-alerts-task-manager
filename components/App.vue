<template>
    <div class="mx-[20px]">
        <div id="column-1" class="float-left w-[25%]">
            <h2 class="text-lg font-bold text-sky-700 mb-[20px]">Projects</h2>
            <div id="projects">
                <ul class="list-disc">
                    <Project
                        v-for="project in projects"
                        :key="project.id"
                        :id="project.id"
                        :title="project.title"
                        :tasks="project.tasks"
                        @changeSelectedProject="selectedProject=project.id"
                        @deleteProject="removeProject(project.id)"
                     />
                </ul>
            </div>
            <div class="mt-[20px]">
                <button @click="projectAddInput=!projectAddInput" class="btn" v-show="!projectAddInput">New project</button>
                <form @submit.prevent="addProject" name="project-add">
                    <input placeholder="Project name" class="w-[70%]" required
                           v-model="newProjectName"
                           v-show="projectAddInput"
                    >
                </form>
            </div>
        </div>
        <div id="column-2" class="float-left w-[75%]">
            <h2 class="text-lg font-bold text-sky-700 float-left">Tasks</h2>
            <button class="mb-[20px] btn float-right" :class="taskAddForm ? 'text-white bg-slate-200' : ''" @click="taskAddForm=!taskAddForm">New task</button>
            <div class="mt-[50px]">
                <form name="task-add" v-show="taskAddForm" @submit.prevent="addTask">
                    <div class="input-group">
                        <label for="task-title">Title:</label>
                        <input placeholder="Name your task" type="text" required v-model="newTitle">
                    </div>
                    <div class="input-group">
                        <label for="task-description">Description:</label>
                        <textarea placeholder="Describe your task" required v-model="newDescription"></textarea>
                    </div>
                    <div class="input-group">
                        <label for="task-priority">Priority:</label>
                        <select required v-model="newPriority">
                            <option value="P1">Very Imortant</option>
                            <option value="P2">Important</option>
                            <option value="P3">Normal</option>
                            <option value="P4">Not Important</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="task-due-date">Due:</label>
                        <input type="datetime-local" required v-model="newDueDate">
                    </div>
                    <button class="mb-[20px] btn">Add task</button>
                </form>
            </div>
            <div id="tasks">
                <div v-for="task in tasks" :key="task.id" v-show="task.project._id===selectedProject">
                    <Task @deleteTask="removeTask(task)"
                        :id="task.id"
                        :title="task.title"
                        :description="task.description"
                        :priority="task.priority"
                        :due_date="task.due_date"
                        :complete="task.complete"
                        :project="task.project"
                     />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { TasksResponse } from '~/server/api/task/all';
    import type { ProjectsResponse } from '~/server/api/project/all';
    import type { TaskEntryMetaItem } from '~/bcms/types/ts';

    let projectAddInput = ref(false);
    let taskAddForm = ref(false);
    let newTitle = ref('');
    let newDescription = ref('');
    let newPriority = ref('P3');
    let newDueDate = ref();
    let newProjectName = ref('');
    let tasks = ref((await useFetch<TasksResponse>('/api/task/all')).data.value);
    let projects = ref((await useFetch<ProjectsResponse>('/api/project/all')).data.value);
    projects.value.forEach(project => project.tasks = tasks.value.filter(task => task.project._id === project.id));
    let selectedProject = ref(projects.value[0].id);

    const removeProject = projectId => {
        projects.value.splice(projects.value.indexOf(projects.value.find(p => p.id === projectId)), 1);
    };

    const removeTask = task => {
        tasks.value.splice(tasks.value.indexOf(tasks.value.find(t => t.id === task.id)), 1);

        // remove the task from the projects as well
        projects.value.find(p => p.id === task.project._id).tasks.splice(
            projects.value.find(p => p.id === task.project._id).tasks
                    .find(t => t.id === task.id),
            1
        );
    };

    const addProject = async () => {
        projectAddInput.value = !projectAddInput.value;

        projects.value.push({title: newProjectName, id: Math.random().toString(36).slice(2), tasks: []});

        selectedProject.value = projects.value[projects.value.length - 1].id;

        await $fetch('/api/project/create', {
            method: 'POST',
            body: {title: newProjectName.value}
        });
    };

    const addTask = async () => {
        taskAddForm.value = !taskAddForm.value;

        let newTask: TaskEntryMetaItem = {
            id: Math.random().toString(36).slice(2),
            title: newTitle.value,
            description: newDescription.value,
            complete: false,
            priority: newPriority.value,
            due_date: {
                timestamp: new Date(newDueDate.value).getTime(),
                timezoneOffset: new Date(newDueDate.value).getTimezoneOffset()
            },
            project: {
                _id: selectedProject.value,
                title: projects.value.filter(project => project.id === selectedProject.value).title
            }
        };

        tasks.value.push(newTask);
        
        projects.value.find(project => project.id == selectedProject.value).tasks.push(newTask);

        await $fetch('/api/task/create', {
            method: 'POST',
            body: {
                title: newTask.title,
                description: newTask.description,
                complete: newTask.complete,
                priority: newTask.priority,
                due_date: newTask.due_date,
                projectId: selectedProject.value,
            }
        });
    }
</script>