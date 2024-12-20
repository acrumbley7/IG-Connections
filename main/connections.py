import json

# Load all of the files needed 
def load(before_folder, after_folder):
    followers_before = []
    followers_after = []
    following = []

    # Reading people you are following 
    # Can compare with followers to see who you are following and is not following back
    with open(before_folder + '/followers_and_following/following.json', 'r') as file:
        data2 = json.load(file)
        data2 = data2['relationships_following']
        with open('following.txt', 'w') as file:
            for i in range(len(data2)):
                following.append(data2[i]['string_list_data'][0]['value'])
                file.write(data2[i]['string_list_data'][0]['value'] + '\n')

    # Reading initial set of followers
    # Used to compare with new list of followers after gain/loss of followers
    with open(before_folder + '/followers_and_following/followers_1.json', 'r') as file:
        data1 = json.load(file)
        for i in range(len(data1)):
            followers_before.append(data1[i]['string_list_data'][0]['value'])

    # Writing to a file showing initial set of followers  -> written to followers_before.txt
    with open('followers_before.txt', 'w') as file:
        file.write(f'count = {len(followers_before)} \n\n')
        for i in range(len(followers_before)):
            file.write(followers_before[i] + '\n')

    # Reading current set of followers 
    # Used to compare to initial set of followers
    with open(after_folder + '/followers_and_following/followers_1.json', 'r') as file:
        data3 = json.load(file)
        for i in range(len(data3)):
            followers_after.append(data3[i]['string_list_data'][0]['value'])

    # Writing to a file showing current set of followers -> written to followers_after.txt
    with open('followers_after.txt', 'w') as file:
        file.write(f'count = {len(followers_after)} \n\n')
        for i in range(len(followers_after)):
            file.write(followers_after[i] + '\n')

    return followers_before, following, followers_after

# List of people you are following and are not following back -> written to not_following_back.txt
def not_following_back(followers, following):
    not_following_you_back = []
    you_not_following_back = []
    for f in following:
        if f not in followers:
            not_following_you_back.append(f)
    for f in followers:
        if f not in following:
            you_not_following_back.append(f)

    with open('not_following_you_back.txt', 'w') as file:
        file.write(f'count = {len(not_following_you_back)} \n\n')
        file.write("\n".join(not_following_you_back))
    with open('you_not_following_back.txt', 'w') as file:
        file.write(f'count = {len(you_not_following_back)} \n\n')
        file.write("\n".join(you_not_following_back))
    return not_following_you_back, you_not_following_back

# List of people that were in initial following set and are not in current following set
def unfollowed(followers_before, followers_after):
    unfollowed = []
    for f in followers_before:
            if f not in followers_after:
                unfollowed.append(f)

    with open('unfollowed.txt', 'w') as file:
        file.write(f'count = {len(unfollowed)} \n\n')
        file.write("\n".join(unfollowed))


def main(before_folder, after_folder):
    followers_before, following, followers_after = load(before_folder, after_folder)
    not_following_back(followers_before, following)
    unfollowed(followers_before, followers_after)
    
if __name__ == '__main__':
    main()