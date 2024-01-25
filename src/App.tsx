import { useEffect, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import Menubar from '@/components/layout/menubar.tsx';
import { IDataBuild } from '@/interfaces/data.interface.ts';
import SkillTreePoint from '@/components/skill-tree-point.tsx';
import { ExternalLink } from 'lucide-react';
import {
  isRegistered,
  register,
  unregister
} from '@tauri-apps/api/globalShortcut';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import useMinMaxValue from '@/hooks/useMinMaxValue.ts';
import { useAppStore } from './stores/app.store';
import { Each } from './lib/each';
import { cn } from './lib/utils';

function App() {
  const [data, setData] = useState<IDataBuild>();
  const { value: currentPoint, setValue: setCurrentPoint } = useMinMaxValue({
    startValue: 1,
    maxValue: data?.meta.max !== undefined ? data.meta.max : Number.MAX_VALUE,
    minValue: 1
  });
  const listRef = useRef(null);
  const inGameMode = useAppStore((state) => state.inGameMode);
  const setInGameMode = useAppStore((state) => state.setInGameMode);

  useEffect(() => {
    fetch('/mock/data.json')
      .then((res) => res.json())
      .then(setData);

    isRegistered('Shift+CommandOrControl+PageDown').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+PageDown', () => {
          setCurrentPoint((prevState) => prevState + 1);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    isRegistered('Shift+CommandOrControl+PageUp').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+PageUp', () => {
          setCurrentPoint((prevState) => prevState - 1);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    isRegistered('Shift+CommandOrControl+Home').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+Home', () => {
          setInGameMode(true);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    isRegistered('Shift+CommandOrControl+End').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+End', () => {
          setInGameMode(false);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    return () => {
      // Unbind to prevent multiple subscription to the event
      unregister('Shift+CommandOrControl+PageDown').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
      unregister('Shift+CommandOrControl+PageUp').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
      unregister('Shift+CommandOrControl+Home').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
      unregister('Shift+CommandOrControl+End').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
    };
  }, []);

  useEffect(() => {
    if (inGameMode) {
      //270 x 400
      appWindow.setSize(new LogicalSize(270, 400));
      appWindow.setAlwaysOnTop(true);
      appWindow.setIgnoreCursorEvents(true);
    } else {
      appWindow.setSize(new LogicalSize(800, 600));
      appWindow.setAlwaysOnTop(false);
      appWindow.setIgnoreCursorEvents(false);
    }
  }, [inGameMode]);

  useEffect(() => {
    if (listRef.current) {
      const scrollToElement = (listRef.current as HTMLElement).children[
        currentPoint - 1
      ];

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
    if (inGameMode) {
      document.body.classList.add('bg-background/70');
    } else {
      document.body.classList.remove('bg-background/70');
    }
  }, [inGameMode]);

  return (
    <section className={cn('h-screen flex flex-col items-stretch')}>
      {!inGameMode && <Menubar />}
      <section className='flex-1 flex flex-col gap-6 overflow-hidden px-5'>
        {!inGameMode && (
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

            <p>Skill Tree</p>
          </>
        )}

        <div
          className={`flex flex-col gap-4 ${
            inGameMode ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
          ref={listRef}
        >
          <Each
            of={data?.data.skill_tree || []}
            render={(point) => (
              <SkillTreePoint
                key={point.order}
                data={point}
                selected={currentPoint === point.order}
                onClick={handlePointClick}
              />
            )}
          />
        </div>
      </section>
    </section>
  );
}

export default App;
