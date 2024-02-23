<template>
  <div>
    <h1>Admin View</h1>
    <p>Admins can see this page</p>
    <RouterLink to="/">Back to home</RouterLink>
    <RouterLink to="/admin/quizzes">Quizzes</RouterLink>
    <RouterLink to="/admin/questions">Questions</RouterLink>
    <RouterView />
  </div>
</template>
