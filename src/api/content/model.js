import mongoose, { Schema } from 'mongoose'

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
      src: this.src,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  },

  play () {
    console.log(`Content "${this.name}" requested for playing`)
  }

}

const model = mongoose.model('Content', contentSchema)

model.create({ name: 'Juventus - Milan', type: 'livestream', src: 'http://localhost/content/0' })
model.create({ name: 'Real Madrid - Barcellona', type: 'livestream', src: 'http://localhost/content/1' })
model.create({ name: 'Catania - Palermo', type: 'livestream', src: 'http://localhost/content/2' })

export const schema = model.schema
export default model
