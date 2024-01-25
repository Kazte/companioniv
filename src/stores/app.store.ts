import { IDataBuild } from '@/interfaces/data.interface';
import { create } from 'zustand';

type State = {
  inGameMode: boolean;
  skillTree?: IDataBuild;
  currentStep: number;
};

type Actions = {
  setInGameMode: (set: boolean) => void;
  setSkillTree: (skillTree: IDataBuild) => void;
  setCurrentStep: (currentStep: number) => void;
};

export const useAppStore = create<State & Actions>((set) => ({
  inGameMode: false,
  currentStep: 0,
  setInGameMode: (inGameMode) => set({ inGameMode }),
  setSkillTree: (skillTree) => set({ skillTree }),
  setCurrentStep: (currentStep) => set({ currentStep })
}));
