import { Router } from 'express'

import UserController from './app/controllers/UserController'
import LoginController from './app/controllers/LoginController'
import SaleController from './app/controllers/SaleController'
import TaxController from './app/controllers/TaxController'

import authMiddleware from './middlewares/auth'

const routes = new Router()

routes.post('/users', UserController.store)
routes.put('/users', authMiddleware, UserController.update)

routes.post('/login', LoginController.store)

routes.get('/sales', authMiddleware, SaleController.index)
routes.post('/sales', authMiddleware, SaleController.store)
routes.put('/sales/:id', authMiddleware, SaleController.update)
routes.delete('/sales/:id', authMiddleware, SaleController.destroy)

routes.get('/tax', authMiddleware, TaxController.index)

export default routes
