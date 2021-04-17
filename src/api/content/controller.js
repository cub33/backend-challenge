import { success, notFound } from '../../services/response/'
import { Content } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Content.create(body)
    .then((content) => content.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Content.find(query, select, cursor)
    .then((contents) => contents.map((content) => content.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Content.findById(params.id)
    .then(notFound(res))
    .then((content) => content ? content.view() : null)
    .then(success(res))
    .catch(next)

export const play = ({ params }, res, next) =>
Content.findById(params.id)
  .then(notFound(res))
  .then((content) => content ? content.play() : null)
  .then(success(res))
  .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Content.findById(params.id)
    .then(notFound(res))
    .then((content) => content ? Object.assign(content, body).save() : null)
    .then((content) => content ? content.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Content.findById(params.id)
    .then(notFound(res))
    .then((content) => content ? content.remove() : null)
    .then(success(res, 204))
    .catch(next)
