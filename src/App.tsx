import {useEffect, useRef, useState} from 'react';
import {invoke} from '@tauri-apps/api/tauri';
import {Button} from './components/ui/button';
import Menubar from '@/components/layout/menubar.tsx';
import {IDataBuild} from '@/interfaces/data.interface.ts';
import SkillTreePoint from '@/components/skill-tree-point.tsx';
import {ExternalLink} from 'lucide-react';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [data, setData] = useState<IDataBuild>();
  const [currentPoint, setCurrentPoint] = useState(1);
  const listRef = useRef(null);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', {name}));
  }

  useEffect(() => {
    fetch('/mock/data.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (listRef.current) {

      // @ts-ignore
      const scrollToElement = listRef.current.children[currentPoint - 1];
      if (scrollToElement) {
        scrollToElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
      }
    }
  }, [currentPoint]);

  const handlePointClick = (order: number) => {
    setCurrentPoint(order);
  };

  return (
    <section className='h-screen flex flex-col items-stretch items-stretch'>
      <Menubar/>
      <section className='flex-1 flex flex-col gap-6 overflow-hidden px-5'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-5xl'>{data?.meta.build_name}</h1>
          <em>by {data?.meta.creator}</em>
        </div>
        <section>
          <Button asChild>
            <a href={data?.meta.url} target='_blank' rel="noreferrer">Open Build <ExternalLink className="ml-2 h-4 w-4"/></a>
          </Button>
        </section>

        <div>
          <Button onClick={() => {
            setCurrentPoint(prevState => prevState + 1);
          }}>Next</Button>
          <Button onClick={() => {
            setCurrentPoint(prevState => prevState - 1);
          }}>Back</Button>
        </div>

        <p>Skill Tree</p>
        <div className='flex flex-col gap-4 h-[1000px] overflow-y-auto' ref={listRef}>
          {
            data?.data.skill_tree.map((point) => {
              return (<SkillTreePoint key={point.order} data={point} selected={currentPoint === point.order}
                onClick={handlePointClick}/>);
            })
          }
        </div>
      </section>
    </section>
  );
}

export default App;