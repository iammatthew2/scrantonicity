import logging
import sqlite3
from sqlite3 import Error


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        logging.error('unable to connect')
        logging.error(e)

    return conn


def add_device_count(conn, task):
    """
    Create a new task
    :param conn:
    :param task:
    :return:
    """

    sql_create_device_counts_table = """ CREATE TABLE IF NOT EXISTS device_counts (
                                        id integer PRIMARY KEY,
                                        count integer NOT NULL,
                                        date_found text NOT NULL
                                    ); """

    sql = ''' INSERT INTO device_counts(count, date_found)
              VALUES(?,?) '''
    cur = conn.cursor()
    cur.execute(sql_create_device_counts_table)
    cur.execute(sql, task)
    conn.commit()
    return cur.lastrowid
