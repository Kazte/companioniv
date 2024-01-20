import { useEffect, useRef, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from './components/ui/button';
import Menubar from '@/components/layout/menubar.tsx';
import { IDataBuild } from '@/interfaces/data.interface.ts';
import SkillTreePoint from '@/components/skill-tree-point.tsx';
import { ExternalLink } from 'lucide-react';
import { register, unregister } from '@tauri-apps/api/globalShortcut';
import * as keyboardjs from 'keyboardjs';
import { KeyEvent } from 'keyboardjs';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import useMinMaxValue from '@/hooks/useMinMaxValue.ts';
import hotkeys from 'hotkeys-js';
import { listen } from '@tauri-apps/api/event';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [data, setData] = useState<IDataBuild>();
  const { value: currentPoint, setValue: setCurrentPoint } = useMinMaxValue({
    startValue: 1,
    maxValue: data?.meta.max!,
    minValue: 1
  });
  const [inGame, setInGame] = useState(false);
  const listRef = useRef(null);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }));
  }

  useEffect(() => {
    fetch('/mock/data.json')
      .then((res) => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      // @ts-ignore
      const scrollToElement = listRef.current.children[currentPoint - 1];
      if (scrollToElement) {
        scrollToElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [currentPoint]);

  const handlePointClick = (order: number) => {
    setCurrentPoint(order);
  };

  useEffect(() => {
    // const unlisten = listen('to_next_item', (event) => {
    //   setCurrentPoint((prevState) => prevState + 1);
    // });

    register('Shift+PageDown', () => {
      setCurrentPoint((prevState) => prevState + 1);
    }).catch((error) => {
      console.error('Failed to register global shortcut', error);
    });

    register('Shift+PageUp', () => {
      setCurrentPoint((prevState) => prevState - 1);
    }).catch((error) => {
      console.error('Failed to register global shortcut', error);
    });

    register('Shift+Home', () => {
      setInGame((prevState) => {
        const newState = !prevState;

        if (newState) {
          //270 x 400
          appWindow.setSize(new LogicalSize(270, 400));
          appWindow.setAlwaysOnTop(true);
          appWindow.setIgnoreCursorEvents(true);
        } else {
          appWindow.setSize(new LogicalSize(800, 600));
          appWindow.setAlwaysOnTop(false);
          appWindow.setIgnoreCursorEvents(false);
        }

        return newState;
      });
    }).catch((error) => {
      console.error('Failed to register global shortcut', error);
    });

    // hotkeys('shift + pageup', (e: KeyboardEvent) => {
    //   setCurrentPoint((prevState) => prevState - 1);
    // });

    // hotkeys('shift + pagedown', (e: KeyboardEvent) => {
    //   setCurrentPoint((prevState) => prevState + 1);
    // });

    // hotkeys('shift + home', (e: KeyboardEvent) => {
    //   setInGame((prevState) => {
    //     const newState = !prevState;

    //     if (newState) {
    //       //270 x 400
    //       appWindow.setSize(new LogicalSize(270, 400));
    //       appWindow.setAlwaysOnTop(true);
    //       appWindow.setIgnoreCursorEvents(true);
    //     } else {
    //       appWindow.setSize(new LogicalSize(800, 600));
    //       appWindow.setAlwaysOnTop(false);
    //       appWindow.setIgnoreCursorEvents(false);
    //     }

    //     return newState;
    //   });
    // });

    return () => {
      // Unbind to prevent multiple subscription to the event
      // uunregister('CommandOrControl+N').catch((error) => {
      //   console.error('Failed to unregister global shortcut', error);
      // });
      // unlisten.then((fn) => fn());
      // hotkeys.unbind('shift + pageup');
      // hotkeys.unbind('shift + pagedown');
      // hotkeys.unbind('shift + home');
    };
  }, []);

  return (
    <section className='h-screen flex flex-col items-stretch items-stretch'>
      {!inGame && <Menubar />}
      <section className='flex-1 flex flex-col gap-6 overflow-hidden px-5'>
        {!inGame && (
          <>
            <div className='flex flex-col gap-2'>
              <h1 className='text-5xl'>{data?.meta.build_name}</h1>
              <em>by {data?.meta.creator}</em>
            </div>
            <section>
              <Button asChild>
                <a href={data?.meta.url} target='_blank' rel='noreferrer'>
                  Open Build <ExternalLink className='ml-2 h-4 w-4' />
                </a>
              </Button>
            </section>

            <div className='flex flex-row gap-3 w-full justify-center'>
              <Button
                onClick={() => {
                  setCurrentPoint((prevState) => prevState - 1);
                }}
              >
                Back
              </Button>
              <Button
                onClick={() => {
                  setCurrentPoint((prevState) => prevState + 1);
                }}
              >
                Next
              </Button>
            </div>

            <p>Skill Tree</p>
          </>
        )}

        <div
          className={`flex flex-col gap-4 ${
            inGame ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
          ref={listRef}
        >
          {data?.data.skill_tree.map((point) => {
            return (
              <SkillTreePoint
                key={point.order}
                data={point}
                selected={currentPoint === point.order}
                onClick={handlePointClick}
              />
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default App;
