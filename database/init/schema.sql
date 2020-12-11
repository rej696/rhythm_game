-- Create Tables and initialise content

drop table if exists scores;

create table if not exists scores (
    id integer primary key,
    username text not null,
    score integer not null
);

insert into scores (username, score)
values 
("Rupert", -100);