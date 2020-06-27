const { Sequelize, Model, DataTypes } = require('sequelize');

const BookmarkModel = {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  description: DataTypes.TEXT,
  image: DataTypes.TEXT,
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}
const BookmarkSchema = {
  $id: 'bookmark',
  type: 'object',
  required: ['source', 'title', 'url'],
  properties: {
    id: { type: 'string' },
    description: { type: ['string', null] },
    image: { type: ['string', null] },
    source: { type: 'string' },
    title: { type: 'string' },
    url: { type: 'string' },
    createdAt: { type: 'string' },
  }
}

async function routes (fastify, options) {
  const Bookmark = fastify.db.define('bookmark', BookmarkModel)
  Bookmark.sync()

  fastify.addSchema(BookmarkSchema)

  const ListOptions = {
    schema: {
      response: {
        200: {
          type: 'array',
          bookmarks: {
            $ref: "#bookmark"
          }
        }
      }
    }
  }
  const CreateOptions = {
    schema: {
      body: {
        type: 'object',
        properties: {
          image: { type: 'string' },
          description: { type: 'string' },
          source: { type: 'string' },
          title: { type: 'string' },
          url: { type: 'string' },
        }
      }
    }
  }
  
  // Routes
  fastify.get('/', async (request, reply) => {
    const bookmarks = await Bookmark.findAll({
      order: [
        ['createdAt', 'DESC'],
      ]
    })
    return { bookmarks }
  })

  fastify.post('/', CreateOptions, async (request, reply) => {
    const { image, description, source, title, url } = request.body
    const bookmark = await Bookmark.create({
      image,
      description,
      source,
      title,
      url
    });
    return { bookmark } 
  })
}

module.exports = routes