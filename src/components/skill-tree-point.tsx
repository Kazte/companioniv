import {ISkillTree} from '@/interfaces/data.interface.ts';

interface Props {
  data: ISkillTree;
  selected: boolean;
  onClick: (order: number) => void;
}

export default function SkillTreePoint(props: Props) {
  return (
    <div className={`${props.selected ? 'bg-accent text-accent-foreground' : ''} cursor-pointer hover:bg-accent`} onClick={() => {
      props.onClick(props.data.order);
    }}>
      <p>Order: {props.data.order}</p>
      <p>Skill: {props.data.skill}</p>
      <p>Cluster: {props.data.cluster}</p>
    </div>
  );
}