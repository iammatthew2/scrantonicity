import logging
import os
import sqlite3
from sqlite3 import Error

# this util should be a class:
# conn = new DbConnection(db)
# conn.doStuff()

def get_rows_greater_than(conn, ident, useUglyAverage = False):
    print(f'get greater: {os.getcwd()}')
    """
        Get rows with greter ID
    """
    if useUglyAverage:
        sql = "SELECT id, count, date_found, AVG(count) OVER ( ORDER BY id ROWS BETWEEN 1000 PRECEDING AND 1 PRECEDING ) average FROM device_counts WHERE ID > ? ORDER BY ID DESC;"
    else:
        sql = "SELECT * from device_counts WHERE ID > ? ORDER BY ID DESC;"

    cur = conn.cursor()
    cur.execute(sql, [ident])
    return cur.fetchall()

def get_last_rows(conn, count, useUglyAverage = False):
    print(f'get last rows: {os.getcwd()}')
    """
        Get the last row in the DB
        Temp method
    """
    if useUglyAverage:
        sql = "SELECT id, count, date_found, AVG(count) OVER ( ORDER BY id ROWS BETWEEN 1000 PRECEDING AND 1 PRECEDING ) average FROM device_counts ORDER BY ID DESC LIMIT ?;"
    else:
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
    try:
        conn = sqlite3.connect(db_file)
        # verify_db(conn)
        return conn
    except Error as e:
        print(f'unable to connect - create_connection() - db file: {db_file}')
        print(f'error: {e}')
        logging.error('unable to connect')
        logging.error(e)
        return None


def verify_db(conn):
    """
    Check if db has expected table
    """

    sql_verify_db = """SELECT 1 from device_counts limit 1;"""
    cur = conn.cursor()
    try:
        cur.execute(sql_verify_db)
    except Error as e:
        print('verify_db failed')
        logging.error(f'table not found - current working dir: {os.getcwd()}')
        logging.error(e)

    return cur.fetchall()

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
