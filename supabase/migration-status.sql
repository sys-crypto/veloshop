-- Run this in the Supabase SQL Editor if you already ran schema.sql before
-- (i.e. your orders/order_items tables already exist). Safe to run even if
-- the column is already there.

alter table public.orders add column if not exists status text not null default 'pending';
