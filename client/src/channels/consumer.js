import { createConsumer } from '@rails/actioncable';
import { cableUrl } from '../requests/routes';

export default createConsumer(cableUrl());
