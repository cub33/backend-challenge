import mongoose, { Schema } from 'mongoose'
import { createLogger } from '../../utils/logger'
const logger = createLogger({ctx: 'content_model'})

const contentSchema = new Schema({
  name: {
    type: String
  },
  type: {
    type: String,
    enum: ['livestream', 'vod']
  },
  thumbnail: {
    type: String
  },
  src: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

contentSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  },

  play () {
    logger.info(`Content "${this.name}" requested for playing`)
    return this.src
  }

}

const model = mongoose.model('Content', contentSchema)

model.create({ name: 'Juventus - Milan', type: 'livestream', src: 'http://localhost/content/0' })
model.create({ name: 'Real Madrid - Barcellona', type: 'livestream', src: 'http://localhost/content/1' })
model.create({ name: 'Catania - Palermo', type: 'livestream', src: 'http://localhost/content/2' })

export const schema = model.schema
export default model
