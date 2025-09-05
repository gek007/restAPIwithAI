import express from 'express';
import {tokenAuthentication} from '../util/auth.js'
import {upload} from '../util/upload.js'

import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  registerEventController,
  unregisterEventController
} from '../controllers/event-controllers.js';


const router = express.Router();

// Get all events
router.get('/',  getAllEventsController)

// router.get('/', (req, res) => {
//   console.log('🛣️ GET /events route called');
//   getAllEventsController(req, res);
// });

// Get event by id
router.get('/:id', getEventByIdController)

// router.get('/:id', (req, res) => {
//   console.log('🛣️ GET /events/:id route called with ID:', req.params.id);
//   getEventByIdController(req, res);
// });



// Create a new event
router.post('/', tokenAuthentication, upload.single('image'), createEventController)

// router.post('/', (req, res) => {
//   console.log('🛣️ POST /events route called');
//   createEventController(req, res);
// });


// Edit (update) an event by id
router.put('/:id', tokenAuthentication, updateEventController)

// router.put('/:id', (req, res) => {
//   console.log('🛣️ PUT /events/:id route called with ID:', req.params.id);
//   updateEventController(req, res);
// });

// Delete an event by id
router.delete('/:id', tokenAuthentication, deleteEventController)

// router.delete('/:id', (req, res) => {
//   console.log('🛣️ DELETE /events/:id route called with ID:', req.params.id);
//   deleteEventController(req, res);
// });


router.post('/:id/register', tokenAuthentication, registerEventController)
router.post('/:id/unregister', tokenAuthentication, unregisterEventController)


export default router;
