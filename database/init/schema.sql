-- Create Tables and initialise content

create table if not exists scores (
    id integer primary key,
    username text not null,
    score integer not null
);

insert into scores (username, score)
values 
("rej696", 91),
("handjacobsanitiser", 76),
("avocadobelly", 89),
("unawarewolf", 63),
("bef", 39);