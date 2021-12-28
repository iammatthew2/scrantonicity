import logging
import sqlite3
from sqlite3 import Error


def get_rows_greater_than(conn, ident):
    """
        Get rows with greter ID
    """
    sql = "SELECT * from device_counts WHERE ID > ?;"

    cur = conn.cursor()
    cur.execute(sql, [ident])
    return cur.fetchall()

def get_last_rows(conn, count):
    """
        Get the last row in the DB
        Temp method
    """
    
    sql = "SELECT * FROM device_counts ORDER BY ID DESC LIMIT ?;"

    cur = conn.cursor()
    cur.execute(sql, [count])
    return cur.fetchall()

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


def add_device_count(conn, count):
    """
    Create a new count
    :param conn:
    :param count:
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
    cur.execute(sql, count)
    conn.commit()
    return cur.lastrowid
