"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import { ToastContainer, Bounce, toast } from 'react-toastify';

interface IForm {
  name: string;
  dictionary: string;
  arrays: string;
  other: string;
}

interface Result {
  name: string;
  dictionary: { [key: string]: string };
  arrays: { [key: string]: string[] };
  other: string[];
}

export default function Home() {
  const { register, handleSubmit } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = (data) => {
    try {
      const result: Result = {
        name: data.name,
        dictionary: {},
        arrays: {},
        other: data.other.split("\n"),
      };
      data.dictionary.split("\n").map(el => {
        const [key, value] = el.split("-");
        result.dictionary[key.trim()] = value.trim();
      });
      let currHeader = "";
      data.arrays.split("\n").map(el => {
        if(el.trim().endsWith(":")) {
          currHeader = el.split(":")[0];
          result.arrays[currHeader] = [];
          return;
        }
        if(result.arrays[currHeader] === undefined) result.arrays[currHeader] = [];
        result.arrays[currHeader].push(el);
      });
      navigator.clipboard.writeText(JSON.stringify(result, undefined, 4));
      toast.success("Результат скопирован в буфер обмена!");
    } catch(e) {
      console.error(e);
      toast.error("Вы нарушили правила ввода!");
    }
  }

  return (
    <div className="flex justify-center min-h-screen w-full bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="pc:my-10 my-5 pc:px-0 px-1 pc:items-start items-center flex flex-col gap-5 max-w-125 pc:w-125 w-full">
        <h1 className='text-3xl font-bold mb-2'>Форматтер</h1>
        <div className="relative w-full">
          <input 
            type="text" 
            className="input w-full rounded-xl outline-1 outline-foreground p-3 text-2xl opacity-50 duration-200 hover:opacity-100 focus:opacity-100" placeholder='Название судна' 
            {...register("name")}
          />
          <h2 className="absolute -top-5 left-4 px-1 py-0.5 bg-background roundend-sm duration-100 opacity-0">Название судна</h2>
        </div>
        <div className="relative w-full">
          <textarea 
            {...register("dictionary")}
            placeholder={'ключ1 - значение1\nключ2 - значение2'}
            className="input w-full rounded-xl outline-1 outline-foreground p-3 text-xl opacity-50 duration-200 hover:opacity-100 focus:opacity-100 h-50"
          >
          </textarea>
          <h2 className="absolute -top-5 left-4 px-1 py-0.5 bg-background roundend-sm duration-100 opacity-0">Словарь</h2>
        </div>
        <div className="relative w-full">
          <textarea 
            {...register("arrays")}
            placeholder={'ключ1:\nзначение1\nзначение2\nключ2:\nзначение3\nзначение4'}
            className="input w-full rounded-xl outline-1 outline-foreground p-3 text-xl opacity-50 duration-200 hover:opacity-100 focus:opacity-100 h-50"
          >
          </textarea>
          <h2 className="absolute -top-5 left-4 px-1 py-0.5 bg-background roundend-sm duration-100 opacity-0">Массивы</h2>
        </div>
        <div className="relative w-full">
          <textarea 
            {...register("other")}
            placeholder={'значение1\nзначение2'}
            className="input w-full rounded-xl outline-1 outline-foreground p-3 text-xl opacity-50 duration-200 hover:opacity-100 focus:opacity-100 h-50"
          >
          </textarea>
          <h2 className="absolute -top-5 left-4 px-1 py-0.5 bg-background roundend-sm duration-100 opacity-0">Прочее</h2>
        </div>
        <button type="submit" className='w-full py-4 cursor-pointer text-2xl font-bold outline-1 outline-foreground text-foreground duration-200 hover:scale-105 rounded-2xl'>
          Форматировать
        </button>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}
