import React from "react";

export default function DashboardPage(props) {
  console.log(props, "Props");
  return (
    <div>
      <h1>This is dashboard page.</h1>
    </div>
  );
}

export async function getStaticProps(context) {
  const result = await fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.json())
    .then((json) => console.log(json));

  return {
    props: { data: result }, // will be passed to the page component as props
  };
}
