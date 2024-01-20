export interface IDataBuild {
  meta: IMeta
  data: IData
}

export interface IMeta {
  build_name: string
  creator: string
  url: string
  max: number
}

export interface IData {
  skill_tree: ISkillTree[]
}

export interface ISkillTree {
  order: number
  skill: string
  cluster: string
}
