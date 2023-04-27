import React from "react";

export default function DashboardPage(props) {
  console.log(props, "Props");
  return (
    <div>
      <h1>This is dashboard page.</h1>
      {props.data || "N/A"}
    </div>
  );
}

export async function getStaticProps(context) {
  const result = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await result.json();

  return {
    props: { data }, // will be passed to the page component as props
  };
}
