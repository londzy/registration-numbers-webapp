

drop table if exists towns CASCADE;

create table towns(
	id serial not null primary key,
	town_name text not null,
	town text not null
);

drop table if exists reg_numbers;

create table reg_numbers(
	id serial not null primary key,
	reg text not null,
	town_tag int not null,
	foreign key (town_tag) references towns(id)

);





INSERT INTO towns (town_name, town) VALUES ('Cape Town', 'CA');
INSERT INTO towns (town_name, town) VALUES ('Bellville', 'CY');
INSERT INTO towns (town_name, town) VALUES ('Paarl', 'CJ');
INSERT INTO towns (town_name, town) VALUES ('George', 'CAW');
INSERT INTO towns (town_name, town) VALUES ('Stellenbosch', 'CL');
