# Name : Iris Beerepoot
# Student number : 10309071
'''
This module contains an implementation of split_string.
'''

# You are not allowed to use the standard string.split() function, use of the
# regular expression module, however, is allowed.
# To test your implementation use the test-exercise.py script.

# A note about the proper programming style in Python:
#
# Python uses indentation to define blocks and thus is sensitive to the
# whitespace you use. It is convention to use 4 spaces to indent your
# code. Never, ever mix tabs and spaces - that is a source of bugs and
# failures in Python programs.


def split_string(source, separators):
    '''
    Split a string <source> on any of the characters in <separators>.

    The ouput of this function should be a list of strings split at the
    positions of each of the separator characters.
    '''
    # create variable for list to be outputted
    outputlist = []
    # if string in source is empty, return the empty list
    if source == '':
        return outputlist
    # if separator is empty, just return the list
    if separators == '':
        outputlist.append(source)
        return outputlist
    # create variable to add the characters of the current string to
    stringinlist = ""
    # walk through every character in the source string
    for character in source:
        # check if the current character is one of the separators
        if character in separators:
            # take the characters to the left of the separator and put this string in list
            if stringinlist:
                outputlist.append(stringinlist)
                stringinlist = ""
        # if the current character is not one of the separators
        else:
            # add this character to the current string
            stringinlist += character
    # make sure the characters to the right of the last separator also gets added to the list
    if stringinlist:
        outputlist.append(stringinlist)
    return outputlist

if __name__ == '__main__':
    # You can try to run your implementation here, that will not affect the
    # automated tests.
    print split_string('abacadabra', 'ba')  # should print: ['c', 'd', 'r']
