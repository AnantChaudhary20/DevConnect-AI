def merge_sort(values, key=None):
    """Recursive merge sort. Time: O(n log n), space: O(n)."""
    key = key or (lambda value: value)
    if len(values) <= 1:
        return list(values)

    middle = len(values) // 2
    left = merge_sort(values[:middle], key=key)
    right = merge_sort(values[middle:], key=key)

    merged = []
    left_index = right_index = 0

    while left_index < len(left) and right_index < len(right):
        if key(left[left_index]) <= key(right[right_index]):
            merged.append(left[left_index])
            left_index += 1
        else:
            merged.append(right[right_index])
            right_index += 1

    merged.extend(left[left_index:])
    merged.extend(right[right_index:])
    return merged


def binary_search(values, target):
    """Binary search on a sorted list. Time: O(log n)."""
    low, high = 0, len(values) - 1
    while low <= high:
        middle = (low + high) // 2
        if values[middle] == target:
            return middle
        if values[middle] < target:
            low = middle + 1
        else:
            high = middle - 1
    return -1


def longest_common_subsequence(first, second):
    """Return LCS length using bottom-up dynamic programming. O(m*n)."""
    first = first or ""
    second = second or ""
    previous = [0] * (len(second) + 1)

    for char_first in first:
        current = [0] * (len(second) + 1)
        for j, char_second in enumerate(second, start=1):
            if char_first == char_second:
                current[j] = previous[j - 1] + 1
            else:
                current[j] = max(previous[j], current[j - 1])
        previous = current

    return previous[-1]


def knapsack_select(items, capacity):
    """0/1 knapsack. Time: O(n*capacity), space: O(n*capacity)."""
    capacity = max(0, int(capacity))
    n = len(items)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        effort = max(1, int(items[i - 1].get("effort", 1)))
        value = max(0, int(items[i - 1].get("value", 0)))
        for budget in range(capacity + 1):
            dp[i][budget] = dp[i - 1][budget]
            if effort <= budget:
                dp[i][budget] = max(
                    dp[i][budget],
                    dp[i - 1][budget - effort] + value,
                )

    selected = []
    budget = capacity
    for i in range(n, 0, -1):
        if dp[i][budget] != dp[i - 1][budget]:
            item = items[i - 1]
            selected.append(item)
            budget -= max(1, int(item.get("effort", 1)))

    selected.reverse()
    return selected
