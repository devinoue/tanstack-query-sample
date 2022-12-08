import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type Props = {
  id: number;
};

type GetTodoResponse = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
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
  const [id, setId] = useState(1);
  // Queries

  // Axiosがエラー時に投げるもの一覧。
  // https://axios-http.com/docs/handling_errors

  // useQueryにジェネリックを提供する場合２つの悪い理由がある。
  // 1. 2つしか使わないので他の機能が使われず、不都合が発生する可能性がある
  //３つ目のジェネリクスはselectで返される値(APIから取ってきたデータを変形修正した後のデータ)の型が期待されるのだけど、
  // これをちゃんと入れないエラーになる
  // 2. select を使っている中でエラーが発生するとAxiosErrorではなくErrorが飛ぶ。AxiosErrorを使わないといけないとき以外はErrorでいいと思う
  // https://stackoverflow.com/questions/72321623/whats-the-type-of-react-querys-error-and-how-to-handle-different-cases

  // なので公式ガイドでは基本的にジェネリクスは不要、別の箇所で型付けすればいい、という
  // https://tkdodo.eu/blog/react-query-and-type-script
  // <
  //   GetTodoResponse,
  //   AxiosError<{ message: string }>
  // >
  // だがどう考えてもinstanceofは漏れが発生する。使った方がいいと思う
  // https://tanstack.com/query/v4/docs/typescript#typing-the-error-field

  const { data, isError, error, isLoading } = useQuery<GetTodoResponse, Error>({
    queryKey: ['todos', id],
    queryFn: () => getTodos({ id }),
  });

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  // Mutations
  // 型引数はなくてもいいがErrorがunknownになるので、そこだけは書き換える。
  // 型引数はTData、TError、TVariablesの順番、
  // mutationFn: (variables: TVariables) => Promise<TData>の関係にある。
  // なので、mutationFnは必ずreturnを忘れずに。Promise<void>であってもreturnがないとエラーになる
  // 今回はややっこしいがリクエストとレスポンスが同じPutTodoRequestだが、もしレスポンスがない場合
  // <void, Error, PutTodoRequest>になる。
  const mutation = useMutation<PutTodoRequest, Error, PutTodoRequest>({
    mutationFn: (variables: PutTodoRequest) => {
      // mutation.mutateからの値を確認する
      console.log('mutation.mutateからの値');
      console.log(variables);
      return putTodos({ id: variables.id });
    },
    onSuccess: (data) => {
      console.log('レスポンスの値');
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
    // useQueryでErrorを定義しておくことの利点として、instanceofとか使わんで済むようになる
    return <span>{error.message}</span>;

    // どうしても必要なら以下のようにすればいい
    // if (error instanceof Error) return <span>{error.message}</span>;
    // else return <span>未知のエラーが発生しました</span>;
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
              // この値はTVariablesは、mutationFnに送られる
              mutation.mutate({
                id,
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
