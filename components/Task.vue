<template>
	<section class="pb-[20px] border-t-[1px]" :class="complete ? 'opacity-30' : ''" @dblclick="taskEditForm=!taskEditForm" v-show="!taskEditForm"  @mouseover="taskHover=true" @mouseleave="taskHover=false">
		<h3 class="task-title mt-[15px] font-bold text-slate-700">
			<input class="task-complete ml-[-28px] mr-[10px]" type="checkbox" @input="complete=!complete; updateTask()" :checked="complete">
			{{title}}
		</h3>
		<span v-show="taskHover" class="float-right border-gray-200 px-1 text-sky-700 border-[1px] rounded" @click="deleteTask">&#10060;</span>
		<p class="mt-[2px] mb-[15px]">{{description}}</p>
		<time class="italic mr-[30px]">Due {{moment(due_date.timestamp).fromNow()}}</time>
		<span class="italic">Priority: {{getPriority()}}</span>
	</section>
	<form class="border-t-[1px] pt-[15px]" v-show="taskEditForm" name="task-edit" @submit.prevent="taskEditForm=!taskEditForm; updateTask()">
		<div class="input-group">
			<label for="task-title">Title:</label>
			<input placeholder="Name your task" type="text" id="task-title" required v-model="title">
		</div>
		<div class="input-group">
			<label for="task-description">Description:</label>
			<textarea placeholder="Describe your task" required v-model="description">{{description}}</textarea>
		</div>
		<div class="input-group">
			<label for="task-priority">Priority:</label>
			<select required v-model="priority">
				<option value="P1" :selected="priority === 'P1'">Very imortant</option>
				<option value="P2" :selected="priority === 'P2'">Important</option>
				<option value="P3" :selected="priority === 'P3'">Normal</option>
				<option value="P4" :selected="priority === 'P4'">Not important</option>
			</select>
		</div>
		<div class="input-group">
			<label for="task-due-date">Due:</label>
			<input type="datetime-local" required :value="moment(due_date.timestamp).format('YYYY-MM-DDThh:mm')" @input="e => due_date.timestamp = (new Date(e.target.value)).getTime()">
		</div>
		<button class="task-edit-button btn mb-[15px]">Update task</button>
	</form>
</template>

<script setup lang="ts">
	import moment from 'moment';

	const props = defineProps(['id', 'title', 'description', 'due_date', 'priority', 'complete', 'project']);
	const emit = defineEmits(['deleteTask']);

	let id = ref(props.id);
	let title = ref(props.title);
	let description = ref(props.description);
	let priority = ref(props.priority);
	let due_date = ref(props.due_date);
	let project = ref(props.project);
	let complete = ref(props.complete);

	let taskEditForm = ref(false);
	let taskHover = ref(false);

	const getPriority = () => {
		switch (priority._value) {
			case 'P1': return 'Very important';
			case 'P2': return 'Important';
			case 'P3': return 'Normal';
			case 'P4': return 'Not important';
		}
	};

	const updateTask = async () => {
		await $fetch('/api/task/update', {
            method: 'PUT',
            body: {
            	taskId: id.value,
            	title: title.value,
            	description: description.value,
            	priority: priority.value,
            	due_date: due_date.value,
            	complete: complete.value,
            	projectId: project.value._id
            }
        });
	};

	const deleteTask = async () => {
		await $fetch('/api/task/delete', {
            method: 'DELETE',
            body: {taskId: id.value}
        });

		emit('deleteTask');
	}
</script>