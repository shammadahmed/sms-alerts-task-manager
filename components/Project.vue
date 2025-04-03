<template>
	<li @mouseover="projectHover=true" @mouseleave="projectHover=false" @click="$emit('changeSelectedProject')" @dblclick="showInput" v-show="!projectEditInput" :class="{'cursor-pointer': projectHover}">
		{{title}} ({{tasks.length}})
		<span v-show="projectHover" class="ml-[10px] text-[11px] text-sky-700 border-[1px] border-gray-200 px-1 rounded" @click="deleteProject">&#10060;</span>
	</li>
	<form @submit.prevent="updateProject"  name="project-edit">
		<input ref="projectEdit" placeholder="Project name" class="w-[70%]" v-show="projectEditInput" v-model="title" required>
	</form>
</template>

<script setup lang="ts">
	const props = defineProps(['id', 'title', 'tasks']);
	const emit = defineEmits(['changeSelectedProject', 'deleteProject']);

	let id = ref(props.id);
	let title = ref(props.title);
	let tasks = ref(props.tasks);

	let projectEdit = ref(null)
	let projectEditInput = ref(false);
	let projectHover = ref(false);

	const showInput = async () => {
		projectEditInput.value=!projectEditInput.value;

		await nextTick();

		projectEdit.value.focus();
	}

	const updateProject = async () => {
		projectEditInput.value = !projectEditInput.value;

    await $fetch('/api/project/update', {
        method: 'PUT',
        headers: {},
        body: {
          projectId: id.value, title: title.value
        }
    })
	}

	const deleteProject = async () => {
		await $fetch('/api/project/delete', {
        method: 'DELETE',
        headers: {},
        body: {
          projectId: id.value
        }
    });

    emit('deleteProject');
	};
</script>