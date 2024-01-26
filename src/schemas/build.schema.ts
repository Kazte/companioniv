const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'CompanionIV Schema',
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        build_name: {
          type: 'string'
        },
        creator: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        max: {
          type: 'number'
        }
      },
      required: ['build_name', 'creator', 'url', 'max']
    },
    data: {
      type: 'object',
      properties: {
        skill_tree: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              order: {
                type: 'number'
              },
              skill: {
                type: 'string'
              },
              cluster: {
                type: 'string'
              }
            },
            required: ['order', 'skill', 'cluster']
          }
        }
      },
      required: ['skill_tree']
    }
  },
  required: ['meta', 'data']
};

export default schema;
