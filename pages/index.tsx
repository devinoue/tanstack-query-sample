import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type GetTodoContext = {
  id: number;
};

const getTodos = async ({
  queryKey,
}: QueryFunctionContext<[string, GetTodoContext]>) => {
  const ctx = queryKey[1];
  const id = ctx.id;
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
  );
  return res.data;
};

export default function Home() {
  const [id, setId] = useState(1);
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos', { id }],
    queryFn: getTodos,
  });

  if (isLoading) return <>LOADING</>;
  if (isError) {
    if (error instanceof Error) {
      return <span>{error.message}</span>;
    }
  }

  return (
    <div>
      <div>APIから取得した内容: {JSON.stringify(data)}</div>
      <div>
        <input onChange={(e) => setId(Number(e.target.value))} type='text' />
      </div>
    </div>
  );
}
