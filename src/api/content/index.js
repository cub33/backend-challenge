import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, play, update, destroy } from './controller'
import { schema } from './model'
export Content, { schema } from './model'

const router = new Router()
const { name, type, src } = schema.tree

/**
 * @api {post} /content Create content
 * @apiName CreateContent
 * @apiGroup Content
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Content's name.
 * @apiParam type Content's type.
 * @apiParam src Content's src.
 * @apiSuccess {Object} content Content's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ name, type, src }),
  create)

/**
 * @api {get} /content Retrieve contents
 * @apiName RetrieveContents
 * @apiGroup Content
 * @apiUse listParams
 * @apiSuccess {Object[]} contents List of contents.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /content/:id Retrieve content
 * @apiName RetrieveContent
 * @apiGroup Content
 * @apiSuccess {Object} content Content's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 */
router.get('/:id',
  show)

/**
 * @api {get} /content/:id/play Reproduce content
 * @apiName PlayContent
 * @apiGroup Content
 * @apiSuccess {Object} content Content's video.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 */
router.get('/:id/play',
  play)

/**
 * @api {put} /content/:id Update content
 * @apiName UpdateContent
 * @apiGroup Content
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Content's name.
 * @apiParam type Content's type.
 * @apiParam src Content's src.
 * @apiSuccess {Object} content Content's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Content not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ name, type, src }),
  update)

/**
 * @api {delete} /content/:id Delete content
 * @apiName DeleteContent
 * @apiGroup Content
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Content not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
