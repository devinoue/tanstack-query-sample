import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type Props = {
  id: number;
};

const getTodos = async ({ id }: Props) => {
  console.log('getTodo start');
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
  );
  return res.data;
};

const putTodos = async ({ id }: Props) => {
  console.log('putTodo start');
  const res = await axios.put(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
  );
  return res.data;
};
type PutTodoRequest = {
  body: string;
  id: number;
  title: string;
  userId: number;
};
export default function Mutation() {
  // Queries

  const [id, setId] = useState(1);
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos', id],
    queryFn: () => getTodos({ id }),
  });

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation<PutTodoRequest, Error, PutTodoRequest>({
    mutationFn: () => putTodos({ id }),
    onSuccess: (data) => {
      console.log(data);
      // クエリをstale としてマークされる=古いと判断して再取得できるように
      // つまりまたgetTodoが動作する
      // setQueryDataを使って直接キャッシュにデータを入れることもできる
      // ほとんどの場合、無効化を優先するべき
      // https://tkdodo.eu/blog/mastering-mutations-in-react-query
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
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
      <div>
        {mutation.isLoading ? 'Adding todo...' : null}
        {mutation.isError ? (
          <div>An error occurred: {mutation.error.message}</div>
        ) : null}
        {mutation.isSuccess ? <div>Todo added!</div> : null}
      </div>
      <div>
        <button
          onClick={
            () => {
              mutation.mutate({
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
              });
            }
            // mutateは一つの引数(オブジェクト)しか取れない
          }
        >
          {' '}
          PUT 送信{' '}
        </button>
      </div>
    </div>
  );
}