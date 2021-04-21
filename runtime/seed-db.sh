#!/bin/bash

DB_URL=$DB_PREFIX://$DB_USERNAME:$DB_PASSWORD@$DB_HOST$DB_PORT/$DB_DATABASE?authSource=admin

node_modules/.bin/migrate up -d $DB_URL --autosync
